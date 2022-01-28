import { Database } from "../src/database";
import { minutes } from "./utils";

describe("Queries Across Tables", () => {
  let db: Database;

  beforeAll(async () => {
    db = await Database.fromExisting("06", "07");
  }, minutes(3));

  it(
    "should select top three directors ordered by total budget spent in their movies",
    async done => {
      const query = `Select full_name AS director, 
                     ROUND(SUM(budget_adjusted),2) AS total_budget
                     FROM movie_directors 
                     JOIN directors ON director_id = directors.id
                     JOIN movies ON movie_id = movies.id
                     GROUP BY full_name
                     ORDER BY SUM(budget_adjusted) DESC
                     Limit 3`;

      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          director: "Ridley Scott",
          total_budget: 722882143.58
        },
        {
          director: "Michael Bay",
          total_budget: 518297522.1
        },
        {
          director: "David Yates",
          total_budget: 504100108.5
        }
      ]);

      done();
    },
    minutes(3)
  );

  it(
    "should select top 10 keywords ordered by their appearance in movies",
    async done => {
      const query = `Select keyword, COUNT(movies.id) AS count
                     FROM movie_keywords 
                     JOIN keywords ON keyword_id = keywords.id
                     JOIN movies ON movie_id = movies.id
                     GROUP BY keyword
                     ORDER BY COUNT(movies.id) DESC
                     LIMIT 10`;

      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          keyword: "woman director",
          count: 162
        },
        {
          keyword: "independent film",
          count: 115
        },
        {
          keyword: "based on novel",
          count: 85
        },
        {
          keyword: "duringcreditsstinger",
          count: 82
        },
        {
          keyword: "biography",
          count: 78
        },
        {
          keyword: "murder",
          count: 66
        },
        {
          keyword: "sex",
          count: 60
        },
        {
          keyword: "revenge",
          count: 51
        },
        {
          keyword: "sport",
          count: 50
        },
        {
          keyword: "high school",
          count: 48
        }
      ]);

      done();
    },
    minutes(3)
  );

  it(
    "should select all movies called Life and return amount of actors",
    async done => {
      const query = `Select original_title, COUNT(actors.id) AS count
                     FROM movie_actors 
                     JOIN actors ON actor_id = actors.id
                     JOIN movies ON movie_id = movies.id
                     WHERE original_title = 'Life'`;

      const result = await db.selectSingleRow(query);

      expect(result).toEqual({
        original_title: "Life",
        count: 12
      });

      done();
    },
    minutes(3)
  );

  it(
    "should select three genres which has most ratings with 5 stars",
    async done => {
      const query = `Select  genre, COUNT(rating) AS five_stars_count
                     FROM movie_genres 
                     JOIN genres ON genre_id = genres.id
                     JOIN movie_ratings ON movie_genres.movie_id = movie_ratings.movie_id
                     WHERE rating = 5
                     GROUP BY genre
                     ORDER BY COUNT(movie_genres.movie_id) DESC
                     LIMIT 3`;

      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          genre: "Drama",
          five_stars_count: 15052
        },
        {
          genre: "Thriller",
          five_stars_count: 11771
        },
        {
          genre: "Crime",
          five_stars_count: 8670
        }
      ]);

      done();
    },
    minutes(3)
  );

  it(
    "should select top three genres ordered by average rating",
    async done => {
      const query = `Select  genre, ROUND(AVG(rating),2) AS avg_rating
                     FROM movie_genres 
                     JOIN genres ON genre_id = genres.id
                     JOIN movie_ratings ON movie_genres.movie_id = movie_ratings.movie_id
                     GROUP BY genre
                     ORDER BY AVG(rating) DESC
                     LIMIT 3`;

      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          genre: "Crime",
          avg_rating: 3.79
        },
        {
          genre: "Music",
          avg_rating: 3.73
        },
        {
          genre: "Documentary",
          avg_rating: 3.71
        }
      ]);

      done();
    },
    minutes(3)
  );
});
