import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class ReportesService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  // Consulta relacional #1: reporte semanal por grupo.
  // Objetivo: darle al admin, de un vistazo, el estado de cada grupo en una semana
  // (lider, ubicacion, horario, asistentes al grupo, asistentes al domingo y ofrenda recaudada).
  async reporteSemanal(inicio?: string, fin?: string) {
    if (!inicio || !fin) {
      throw new BadRequestException('Debes indicar los parametros inicio y fin (YYYY-MM-DD)');
    }

    return this.dataSource.query(
      `SELECT
         g.id AS id_grupo,
         g.nombre AS grupo,
         u.nombre AS lider,
         g.ubicacion,
         g.dia_semana,
         g.hora,
         COUNT(DISTINCT CASE WHEN a.tipo = 'grupo' AND a.asistio = 1 THEN a.id_miembro END) AS asistentes_grupo,
         COUNT(DISTINCT CASE WHEN a.tipo = 'domingo' AND a.asistio = 1 THEN a.id_miembro END) AS asistentes_domingo,
         COALESCE(SUM(DISTINCT o.monto), 0) AS total_ofrenda
       FROM grupos g
       JOIN usuarios u ON g.id_lider = u.id
       LEFT JOIN asistencias a ON a.id_grupo = g.id AND a.fecha BETWEEN ? AND ?
       LEFT JOIN ofrendas o ON o.id_grupo = g.id AND o.fecha BETWEEN ? AND ?
       GROUP BY g.id
       ORDER BY g.nombre`,
      [inicio, fin, inicio, fin],
    );
  }

  // Consulta relacional #2: grupos con menor asistencia en los ultimos 7 dias.
  // Objetivo: ayudar al admin a detectar grupos que necesitan seguimiento.
  async asistenciaBaja() {
    return this.dataSource.query(
      `SELECT
         g.id AS id_grupo,
         g.nombre AS grupo,
         COUNT(DISTINCT m.id) AS total_miembros,
         COUNT(DISTINCT CASE WHEN a.asistio = 1 THEN a.id_miembro END) AS asistieron_ultima_semana
       FROM grupos g
       JOIN miembros m ON m.id_grupo = g.id
       LEFT JOIN asistencias a
         ON a.id_miembro = m.id AND a.fecha >= CURDATE() - INTERVAL 7 DAY
       GROUP BY g.id
       ORDER BY asistieron_ultima_semana ASC`,
    );
  }
}
