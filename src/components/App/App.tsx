// src/components/App/App.tsx
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";

// Імпортуємо компоненти
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

// Імпортуємо функцію запиту та тип фільму
import { fetchMovies } from "../../services/movieService";
import { type Movie } from "../../types/movie";

export default function App() {
  // стейти для керування екраном
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  // функція обробки пошуку
  const handleSearch = async (topic: string) => {
    try {
      setIsLoading(true);
      setError(false);
      setMovies([]); // Очищаємо старі фільми перед новим пошуком

      // Викликаємо сервіс (замість axios.get напряму)
      const data = await fetchMovies(topic);

      // Перевірка на порожній масив
      if (data.length === 0) {
        toast.error("No movies found for your request.");
        return;
      }

      setMovies(data); // Зберігаємо фільми в стейт
    } catch {
      setError(true); // Якщо помилка
    } finally {
      setIsLoading(false); // Вимикаємо лоадер у будь-якому випадку
    }
  };

  return (
    <>
      {/* Передаємо функцію в SearchBar */}
      <SearchBar onSubmit={handleSearch} />

      {/* Рендер компонентів*/}
      {isLoading && <Loader />}
      
      {error && <ErrorMessage />}
      
      {movies.length > 0 && !isLoading && (
        <MovieGrid movies={movies} onSelect={(movie) => console.log(movie)} />
      )}

      {/* Компонент для спливаючих сповіщень toast */}
      <Toaster position="top-right" />
    </>
  );
}