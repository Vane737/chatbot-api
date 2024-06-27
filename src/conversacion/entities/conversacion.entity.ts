import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cliente } from "src/clientes/entities/cliente.entity";
import { Consulta } from "src/consulta/entities/consulta.entity";


@Entity()
export class Conversacion{

    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ type: 'date' })
    fechaInicio: Date;
    
    @Column({ type: 'date', nullable: true})
    fechaFinal: Date | null

    @ManyToOne(() => Cliente, cliente => cliente.conversaciones)
    cliente: Cliente;

    @OneToMany(() => Consulta, consultas => consultas.conversacion)
    consultas: Consulta[];

}
