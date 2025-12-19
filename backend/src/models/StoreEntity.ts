import { Table, Column, Model, DataType, HasMany, PrimaryKey, Default, CreatedAt } from 'sequelize-typescript';
import { ProductEntity } from './ProductEntity';

@Table({
  tableName: 'stores',
  timestamps: false
})
export class StoreEntity extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  location!: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created_at'
  })
  createdAt!: Date;

  @HasMany(() => ProductEntity, {
    onDelete: 'RESTRICT',
    foreignKey: 'storeId'
  })
  products?: ProductEntity[];
}
