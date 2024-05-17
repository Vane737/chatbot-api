import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cliente {

    @PrimaryGeneratedColumn('increment')
    id: number

    @Column('text')
    nombre: string

    @Column('text',{
        unique: true, nullable: true
    })
    apellido: string| null

    @Column('text', {
        unique: true
    })
    telefono: string

    @Column('text', {
        unique: true, nullable: true
    })
    ci: string | null

    @Column('text', {
        unique: true, nullable: true
    })
    email: string | null
    
    @Column('text', {
        unique: true, nullable: true
    })
    direccion: string | null


}
