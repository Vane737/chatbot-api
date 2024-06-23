import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Propiedad } from "src/propiedad/entities/propiedad.entity";


@Entity()
export class Imagen{

    @PrimaryGeneratedColumn('increment')
    id: number

    @Column('text')
    ubicacion: string

    @Column('text')
    url: string
    
    @ManyToOne(() => Propiedad, propiedad => propiedad.imagenes, { eager: true })
    propiedad: Propiedad;
}
