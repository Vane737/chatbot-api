import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cita } from "src/cita/entities/cita.entity";
import { Conversacion } from "src/conversacion/entities/conversacion.entity";


@Entity()
export class Cliente {

    @PrimaryGeneratedColumn('increment')
    id: number

    @Column('text')
    nombre: string

    @Column('text',{nullable: true})
    apellido: string| null

    @Column('text', {unique: true})
    telefono: string

    @Column('text', {unique: true, nullable: true})
    ci: string | null

    @Column('text', {unique: true, nullable: true})
    email: string | null
    
    @OneToMany(() => Cita, citas => citas.cliente)
    citas: Cita[];

    @OneToMany(() => Conversacion, conversaciones => conversaciones.cliente)
    conversaciones: Conversacion[];

}
