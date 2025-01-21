import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

const dashboardOverview = async () => {
  try {
    const { book, category, user, borrowing } = prismaClient;

    const bookCount = await book.count();
    const categoryCount = await category.count();
    const userActiveCount = await user.count({
      where: {
        role: "USER",
      },
    });
    const recentBorrowBooks = await borrowing.findMany({
      orderBy: {
        borrowDate: "desc",
      },
      select: {
        id: true,
        borrowDate: true,
        book: {
          select: {
            id: true,
            title: true,
            coverImage: true,
          },
        },
      },
    });

    const categoryStats = await category.findMany({
      select: {
        name: true,
        _count: true,
      },
    });

    const specificCategories = ["Mental Health", "Romance", "Fantasy"];
    const chartCategoryBooksData = [];
    let othersCount = 0;

    categoryStats.forEach((stat) => {
      if (specificCategories.includes(stat.name)) {
        chartCategoryBooksData.push({
          category: stat.name.toLowerCase(),
          books: stat._count.books,
        });
      } else {
        othersCount = othersCount + stat._count.books;
      }
    });

    // Add others category
    chartCategoryBooksData.push({
      category: "others",
      books: othersCount,
    });

    const overview = {
      books: bookCount,
      categories: categoryCount,
      users: userActiveCount,
      recentBorrowsBook: recentBorrowBooks,
      chartCategoryBooksData,
    };
    return overview;
  } catch (error) {
    throw new Error(error as string);
  }
};

export const dashboardService = {
  dashboardOverview,
};
