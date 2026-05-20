import { useState, useEffect, useCallback } from 'react';
import {
  Pelicula, PeliculaInput,
  obtenerTodasLasPeliculas, obtenerPeliculaPorId,
  crearPelicula, actualizarPelicula, eliminarPelicula, buscarPeliculas,
} from '../database/database';

interface UsePeliculasReturn {
  peliculas: Pelicula[];
  cargando: boolean;
  error: string | null;
  textoBusqueda: string;
  recargarPeliculas: () => void;
  buscar: (texto: string) => void;
  limpiarBusqueda: () => void;
  agregarPelicula: (datos: PeliculaInput) => number;
  editarPelicula: (id: number, cambios: Partial<PeliculaInput>) => void;
  borrarPelicula: (id: number) => void;
  obtenerPelicula: (id: number) => Pelicula | null;
}

export const usePeliculas = (): UsePeliculasReturn => {
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [textoBusqueda, setTextoBusqueda] = useState<string>('');

  const recargarPeliculas = useCallback((): void => {
    try {
      setCargando(true);
      setError(null);
      const datos = textoBusqueda.trim()
        ? buscarPeliculas(textoBusqueda)
        : obtenerTodasLasPeliculas();
      setPeliculas(datos);
    } catch (err) {
      setError('Error al cargar las películas.');
      console.error('[usePeliculas] recargarPeliculas:', err);
    } finally {
      setCargando(false);
    }
  }, [textoBusqueda]);

  useEffect(() => {
    recargarPeliculas();
  }, [recargarPeliculas]);

  const buscar = useCallback((texto: string): void => {
    setTextoBusqueda(texto);
  }, []);

  const limpiarBusqueda = useCallback((): void => {
    setTextoBusqueda('');
  }, []);

  const agregarPelicula = useCallback(
    (datos: PeliculaInput): number => {
      try {
        const nuevoId = crearPelicula(datos);
        recargarPeliculas();
        return nuevoId;
      } catch (err) {
        setError('Error al agregar la película.');
        throw err;
      }
    }, [recargarPeliculas]
  );

  const editarPelicula = useCallback(
    (id: number, cambios: Partial<PeliculaInput>): void => {
      try {
        actualizarPelicula(id, cambios);
        recargarPeliculas();
      } catch (err) {
        setError('Error al editar la película.');
        throw err;
      }
    }, [recargarPeliculas]
  );

  const borrarPelicula = useCallback(
    (id: number): void => {
      try {
        eliminarPelicula(id);
        recargarPeliculas();
      } catch (err) {
        setError('Error al eliminar la película.');
        throw err;
      }
    }, [recargarPeliculas]
  );

  const obtenerPelicula = useCallback(
    (id: number): Pelicula | null => obtenerPeliculaPorId(id),
    []
  );

  return {
    peliculas, cargando, error, textoBusqueda,
    recargarPeliculas, buscar, limpiarBusqueda,
    agregarPelicula, editarPelicula, borrarPelicula, obtenerPelicula,
  };
};