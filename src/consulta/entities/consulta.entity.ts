import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Conversacion } from "src/conversacion/entities/conversacion.entity";


@Entity()
export class Consulta{

    @PrimaryGeneratedColumn('increment')
    id: number

    @Column('text')
    pregunta: string

    @Column('text',{nullable: true})
    respuesta: string| null

    @Column({ type: 'timestamp' })
    fecha: Date;
    
    @ManyToOne(() => Conversacion, conversacion => conversacion.consultas)
    conversacion: Conversacion;
}
