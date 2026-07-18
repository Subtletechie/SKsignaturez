import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'originalPrice',
      title: 'Original Price',
      description: 'Set this only for sale items, to show the struck-through price.',
      type: 'number',
      validation: (Rule) => Rule.positive(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Women', value: 'women'},
          {title: 'Men', value: 'men'},
          {title: 'Accessories', value: 'accessories'},
          {title: 'Kids', value: 'kids'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'badge',
      title: 'Badge',
      type: 'string',
      options: {
        list: [
          {title: 'New', value: 'new'},
          {title: 'Sale', value: 'sale'},
          {title: 'Best Seller', value: 'bestseller'},
          {title: 'Limited Edition', value: 'limited'},
        ],
      },
    }),
    defineField({
      name: 'isActive',
      title: 'Active (visible on site)',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'category', media: 'image'},
  },
})
