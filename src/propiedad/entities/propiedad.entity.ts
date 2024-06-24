import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Imagen } from "src/imagen/entities/imagen.entity";
import { Caracteristica } from "src/caracteristica/entities/caracteristica.entity";
import { Cita } from "src/cita/entities/cita.entity";
import { Inmueble } from "src/inmueble/entities/inmueble.entity";


@Entity()
export class Propiedad{

    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ type: 'text' })
    titulo: string

    @Column({ type: 'text', nullable: true })
    descripcion: string

    @Column({ type: 'text' })
    direccion: string

    @Column({ type: 'text' })
    superficie: string

    @Column({ type: 'text' })
    precio: string
    
    @Column({ type: 'enum', enum: ['Alquiler', 'Venta'] }) 
    tipo: 'Alquiler' | 'Venta'; 

    @Column({ type: 'boolean'})
    registrado: boolean;

    @ManyToOne(() => Inmueble, inmueble => inmueble.propiedad)
    inmueble: Inmueble;

    @OneToMany(() => Cita, citas => citas.propiedad)
    citas: Cita[];

    @OneToMany(() => Imagen, imagenes => imagenes.propiedad)
    imagenes: Imagen[];

    @OneToMany(() => Caracteristica, caracteristicas => caracteristicas.propiedad)
    caracteristicas: Caracteristica[];

    
}
