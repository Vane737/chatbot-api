import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Propiedad } from "src/propiedad/entities/propiedad.entity";


@Entity()
export class Caracteristica {

    @PrimaryGeneratedColumn('increment')
    id: number

    @Column('text')
    titulo: string

    @Column('text')
    descripcion: string
    
    @ManyToOne(() => Propiedad, propiedad => propiedad.caracteristicas, { eager: true })
    propiedad: Propiedad;
}
