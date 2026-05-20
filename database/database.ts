/**
 * database.ts
 * Módulo SQLite usando expo-sqlite v15 (nueva arquitectura).
 */

import * as SQLite from 'expo-sqlite';

export interface Pelicula {
  id: number;
  titulo: string;
  director: string;
  anio: number;
  genero: string;
  puntuacion: number;
  sinopsis: string;
  vista: number;
  fechaAgregada: string;
}

export type PeliculaInput = Omit<Pelicula, 'id' | 'fechaAgregada'>;

let dbInstancia: SQLite.SQLiteDatabase | null = null;

const obtenerDB = (): SQLite.SQLiteDatabase => {
  if (!dbInstancia) {
    dbInstancia = SQLite.openDatabaseSync('cinelist.db');
  }
  return dbInstancia;
};

export const inicializarBaseDatos = (): void => {
  const db = obtenerDB();

  db.execSync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS peliculas (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo         TEXT    NOT NULL,
      director       TEXT    NOT NULL,
      anio           INTEGER NOT NULL,
      genero         TEXT    NOT NULL,
      puntuacion     REAL    NOT NULL DEFAULT 5,
      sinopsis       TEXT    NOT NULL DEFAULT '',
      vista          INTEGER NOT NULL DEFAULT 0,
      fechaAgregada  TEXT    NOT NULL
    );
  `);

  const resultado = db.getFirstSync<{ total: number }>(
    'SELECT COUNT(*) AS total FROM peliculas;'
  );
  const total = resultado?.total ?? 0;

  if (total === 0) {
    const hoy = new Date().toISOString();
    const ejemplos = [
      { titulo: 'Inception', director: 'Christopher Nolan', anio: 2010, genero: 'Ciencia Ficción', puntuacion: 9, sinopsis: 'Un ladrón que roba secretos mediante la tecnología del sueño.', vista: 1 },
      { titulo: 'El Padrino', director: 'Francis Ford Coppola', anio: 1972, genero: 'Drama', puntuacion: 10, sinopsis: 'La saga de la familia mafiosa Corleone.', vista: 1 },
      { titulo: 'Interstellar', director: 'Christopher Nolan', anio: 2014, genero: 'Ciencia Ficción', puntuacion: 9, sinopsis: 'Exploradores viajan a través de un agujero de gusano.', vista: 0 },
    ];
    for (const p of ejemplos) {
      db.runSync(
        `INSERT INTO peliculas (titulo, director, anio, genero, puntuacion, sinopsis, vista, fechaAgregada)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [p.titulo, p.director, p.anio, p.genero, p.puntuacion, p.sinopsis, p.vista, hoy]
      );
    }
  }
};

export const obtenerTodasLasPeliculas = (): Pelicula[] => {
  const db = obtenerDB();
  return db.getAllSync<Pelicula>('SELECT * FROM peliculas ORDER BY fechaAgregada DESC;');
};

export const obtenerPeliculaPorId = (id: number): Pelicula | null => {
  const db = obtenerDB();
  return db.getFirstSync<Pelicula>('SELECT * FROM peliculas WHERE id = ?;', [id]) ?? null;
};

export const crearPelicula = (pelicula: PeliculaInput): number => {
  const db = obtenerDB();
  const fechaAgregada = new Date().toISOString();
  const resultado = db.runSync(
    `INSERT INTO peliculas (titulo, director, anio, genero, puntuacion, sinopsis, vista, fechaAgregada)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
    [pelicula.titulo, pelicula.director, pelicula.anio, pelicula.genero,
     pelicula.puntuacion, pelicula.sinopsis, pelicula.vista, fechaAgregada]
  );
  return resultado.lastInsertRowId;
};

export const actualizarPelicula = (id: number, cambios: Partial<PeliculaInput>): void => {
  const db = obtenerDB();
  const columnas = Object.keys(cambios) as (keyof PeliculaInput)[];
  const setClause = columnas.map((col) => `${col} = ?`).join(', ');
  const valores = columnas.map((col) => cambios[col] as string | number);
  db.runSync(`UPDATE peliculas SET ${setClause} WHERE id = ?;`, [...valores, id]);
};

export const eliminarPelicula = (id: number): void => {
  const db = obtenerDB();
  db.runSync('DELETE FROM peliculas WHERE id = ?;', [id]);
};

export const buscarPeliculas = (texto: string): Pelicula[] => {
  const db = obtenerDB();
  const termino = `%${texto}%`;
  return db.getAllSync<Pelicula>(
    `SELECT * FROM peliculas WHERE titulo LIKE ? OR director LIKE ? ORDER BY fechaAgregada DESC;`,
    [termino, termino]
  );
};