import { Table, Column, Model, DataType, ForeignKey, BelongsTo, PrimaryKey, Default, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import { StoreEntity } from './StoreEntity';

@Table({
  tableName: 'products',
  timestamps: false
})
export class ProductEntity extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => StoreEntity)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'store_id'
  })
  storeId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  category!: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false
  })
  price!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  quantity!: number;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created_at'
  })
  createdAt!: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    field: 'updated_at'
  })
  updatedAt!: Date;

  @BelongsTo(() => StoreEntity)
  store?: StoreEntity;
}
