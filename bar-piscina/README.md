# Bar de la Piscina — Organizador de terraza

Herramienta de un solo archivo (`index.html`) para repartir las mesas de la terraza
a partir de las reservas del día. Se abre con doble clic: no necesita internet,
ni instalar nada, ni crear cuentas.

## Cómo se usa

1. **Mi terraza** (una sola vez). Cuántas mesas redondas, cuadradas y rectangulares
   hay, cuántas plazas tiene cada una y cuántas sillas hay en total. Aquí también se
   ajustan las reglas de la casa: minutos para recoger entre turnos, cuántas sillas se
   pierden al juntar dos mesas y cuántas mesas se guardan para clientes sin reserva.
2. **Reservas del día**. Se elige día y servicio (mediodía o tarde) y se meten las
   reservas. Para ir rápido, el cuadro *Añadir varias de golpe* acepta una por línea
   tal y como se apuntan a mano: `13:30 Familia Ruiz 6`, `14h Peña El Chapuzón 12 tel 600112233`.
3. **Plan de sala**. El reparto de mesas, el mapa de ocupación por franjas de media hora
   y la hoja de servicio para imprimir.

## Cómo reparte las mesas

- Primero respeta las **mesas fijadas a mano** (columna *Mesa fija*, p. ej. `L1,L2`).
  Lo que se fija manualmente manda siempre sobre el automático.
- Después coloca los **grupos de mayor a menor**, que son los que peor encajan.
- Para cada grupo busca **una sola mesa** que desperdicie los menos sitios posibles. A
  igualdad, gasta antes una redonda, porque las cuadradas y rectangulares hacen falta
  para poder unir.
- Si no cabe en ninguna, **une mesas** (solo cuadradas y rectangulares; las redondas
  van siempre sueltas). Prefiere la combinación que menos sitios desperdicie, con menos
  mesas y del mismo tipo, que queda más recta.
- Una misma mesa puede **dar dos turnos** dentro del servicio si entre un grupo y otro
  cabe la duración media más los minutos de recoger.
- Avisa cuando un grupo se queda sin mesa, cuando faltan sillas para el pico de gente
  sentada a la vez, y cuando una mesa fijada a mano está pillada o se queda corta.

## Dónde se guardan los datos

En el navegador del propio dispositivo (`localStorage`), no en un servidor. Es decir:
lo que se mete en el móvil no aparece en el ordenador del bar. Para pasar los datos de
un sitio a otro, o para tener copia de seguridad, están los botones **Exportar copia** e
**Importar copia**, que generan un archivo `.json`.

Esta carpeta queda fuera del build de la web pública de Martega: es una herramienta
interna, no una página del sitio.
