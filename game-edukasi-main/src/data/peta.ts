import pulauBentuk from '../assets/peta/07_world_01_pulau_bentuk.png'
import hutanSegiEmpat from '../assets/peta/08_world_02_hutan_segi_empat.png'
import pegununganSegitiga from '../assets/peta/09_world_03_pegunungan_segitiga.png'
import danauLingkaran from '../assets/peta/10_world_04_danau_lingkaran.png'
import kastilGeometri from '../assets/peta/11_world_05_kastil_geometri.png'

/*
 * Semua koordinat memakai piksel desain peta (lebar 941px, sama dengan
 * gambar referensi). Posisi dunia relatif terhadap kanvas peta, posisi
 * level relatif terhadap gambar dunianya sendiri.
 */
export const MAP_WIDTH = 941
export const MAP_HEIGHT = 1245

export type LevelPoint = {
  level: number
  x: number
  y: number
}

export type World = {
  id: number
  name: string
  description: string
  image: string
  x: number
  y: number
  width: number
  height: number
  levels: LevelPoint[]
}

export const worlds: World[] = [
  {
    id: 1,
    name: 'Pulau Bentuk',
    description: 'Mengenal bentuk dasar',
    image: pulauBentuk,
    x: 18,
    y: 0,
    width: 503,
    height: 407,
    levels: [
      { level: 1, x: 131, y: 204 },
      { level: 2, x: 266, y: 203 },
      { level: 3, x: 378, y: 221 },
    ],
  },
  {
    id: 2,
    name: 'Hutan Segi Empat',
    description: 'Sisi, sudut dan jenis-jenisnya',
    image: hutanSegiEmpat,
    x: 450,
    y: 146,
    width: 483,
    height: 433,
    levels: [
      { level: 7, x: 170, y: 180 },
      { level: 8, x: 246, y: 206 },
      { level: 9, x: 341, y: 211 },
      { level: 10, x: 138, y: 258 },
      { level: 11, x: 261, y: 284 },
      { level: 12, x: 381, y: 281 },
    ],
  },
  {
    id: 3,
    name: 'Pegunungan Segitiga',
    description: 'Jenis segitiga dan keliling',
    image: pegununganSegitiga,
    x: 0,
    y: 462,
    width: 450,
    height: 395,
    levels: [
      { level: 13, x: 169, y: 178 },
      { level: 14, x: 285, y: 179 },
      { level: 15, x: 395, y: 187 },
      { level: 16, x: 178, y: 270 },
      { level: 17, x: 275, y: 266 },
      { level: 18, x: 377, y: 265 },
    ],
  },
  {
    id: 4,
    name: 'Danau Lingkaran',
    description: 'Jari-jari, diameter dan luas',
    image: danauLingkaran,
    x: 539,
    y: 581,
    width: 392,
    height: 375,
    levels: [
      { level: 19, x: 91, y: 189 },
      { level: 20, x: 194, y: 203 },
      { level: 21, x: 296, y: 194 },
      { level: 22, x: 114, y: 262 },
      { level: 23, x: 219, y: 272 },
      { level: 24, x: 313, y: 262 },
    ],
  },
  {
    id: 5,
    name: 'Kastil Geometri',
    description: 'Gabungan bentuk dan luas',
    image: kastilGeometri,
    x: 248,
    y: 837,
    width: 454,
    height: 408,
    levels: [
      { level: 25, x: 139, y: 241 },
      { level: 26, x: 226, y: 248 },
      { level: 27, x: 314, y: 248 },
      { level: 28, x: 145, y: 313 },
      { level: 29, x: 231, y: 318 },
      { level: 30, x: 321, y: 318 },
    ],
  },
]
