import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Conversacion } from "src/conversacion/entities/conversacion.entity";


@Entity()
export class Consulta{

    @PrimaryGeneratedColumn('increment')
    id: number

    @Column('text')
    rol: string

    @Column('text')
    body: string

    @Column({ type: 'boolean', default: false })
    esCasa: boolean;

    @Column({ type: 'timestamp' })
    fecha: Date;
    
    @ManyToOne(() => Conversacion, conversacion => conversacion.consultas)
    conversacion: Conversacion;
}
