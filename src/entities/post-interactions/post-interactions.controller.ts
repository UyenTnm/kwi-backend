import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
  Req,
  Query,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
// import { RolesGuard } from '../../auth/guards/roles.guard';
import { PostInteractionsService } from './post-interactions.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@ApiTags('Post Interactions')
@ApiBearerAuth()
@Controller('posts')
export class PostInteractionsController {
  constructor(private readonly svc: PostInteractionsService) {}

  // Create comment with images (max 5)
  @UseGuards(AuthGuard('jwt'))
  @Post(':id/comments')
  @UseInterceptors(FilesInterceptor('images', 5))
  @ApiConsumes('multipart/form-data')
  async createComment(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateCommentDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    // build urls from uploaded files (MulterModule.register dest: './uploads')
    const images = (files || []).map((f) => `/uploads/${f.filename}`);
    return this.svc.createComment(id, req.user.id, dto, images);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/comments')
  async listComments(
    @Param('id', ParseIntPipe) id: number,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.svc.listComments(id, Number(page), Number(limit));
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':postId/comments/:cid')
  async deleteComment(
    @Req() req: any,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('cid', ParseIntPipe) cid: number,
  ) {
    const isAdmin = req.user?.role === 'admin';
    return this.svc.deleteComment(cid, req.user.id, isAdmin);
  }

  // Likes
  @UseGuards(AuthGuard('jwt'))
  @Post(':id/like')
  async toggleLike(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.svc.toggleLike(id, req.user.id);
  }

  @Get(':id/likes/count')
  async likesCount(@Param('id', ParseIntPipe) id: number) {
    return this.svc.countLikes(id);
  }

  // Views - if logged in record by user, otherwise pass ip
  @Post(':id/view')
  async recordView(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    const ip = req.ip || req.headers['x-forwarded-for'] || null;
    const userId = req.user?.id;
    return this.svc.recordView(id, userId, ip);
  }

  @Get(':id/views/count')
  async viewsCount(@Param('id', ParseIntPipe) id: number) {
    return this.svc.countViews(id);
  }
}
