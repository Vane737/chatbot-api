import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cliente {

    @PrimaryGeneratedColumn('increment')
    id: number

    @Column('text')
    nombre: string

    @Column('text')
    apellido: string

    @Column('text', {
        unique: true
    })
    telefono: string

    @Column('text', {
        unique: true
    })
    ci: string

    @Column('text', {
        unique: true
    })
    email: string
    
    @Column('text')
    direccion: string


}
