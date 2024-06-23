import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Propiedad } from "src/propiedad/entities/propiedad.entity";
import { Cliente } from "src/clientes/entities/cliente.entity";


@Entity()
export class Cita {

    @PrimaryGeneratedColumn('increment')
    id: number

    @Column('text')
    nombre: string
    
    @ManyToOne(() => Propiedad, propiedad => propiedad.citas, { eager: true })
    propiedad: Propiedad;

    @ManyToOne(() => Cliente, cliente => cliente.citas)
    cliente: Cliente;
    
}
