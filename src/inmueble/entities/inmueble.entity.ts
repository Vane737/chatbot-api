import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Propiedad } from "src/propiedad/entities/propiedad.entity";


@Entity()
export class Inmueble{

    @PrimaryGeneratedColumn('increment')
    id: number

    @Column('text')
    nombre: string
    
    @OneToMany(() => Propiedad, propiedad => propiedad.inmueble)
    propiedad: Propiedad[];
}
