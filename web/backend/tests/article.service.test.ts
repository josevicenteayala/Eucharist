import { articleService } from '../src/services/article.service';
import { Article } from '../src/models/mongodb/article.model';

jest.mock('../src/models/mongodb/article.model');

describe('ArticleService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated articles', async () => {
      const mockArticles = [{ title: 'Test Article' }];
      const mockCount = 1;

      (Article.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              populate: jest.fn().mockResolvedValue(mockArticles),
            }),
          }),
        }),
      });
      (Article.countDocuments as jest.Mock).mockResolvedValue(mockCount);

      const result = await articleService.findAll({});

      expect(result.data).toEqual(mockArticles);
      expect(result.pagination.total).toBe(mockCount);
      expect(Article.find).toHaveBeenCalledWith({ status: 'published' });
    });
  });

  describe('findBySlug', () => {
    it('should return article if found', async () => {
      const mockArticle = { title: 'Test', slug: 'test' };
      (Article.findOne as jest.Mock).mockResolvedValue(mockArticle);

      const result = await articleService.findBySlug('test');
      expect(result).toEqual(mockArticle);
    });

    it('should throw if not found', async () => {
      (Article.findOne as jest.Mock).mockResolvedValue(null);
      await expect(articleService.findBySlug('test')).rejects.toThrow('Article not found');
    });
  });
});
