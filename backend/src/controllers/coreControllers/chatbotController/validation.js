const { z } = require('zod');

// ! all of the describe methods of zod will be passed to AI

const CreateClientSchema = z.object({
  name: z.string().nonempty().min(3).max(150).describe('name of client (required!)'),
  phone: z.string().nonempty().min(3).max(20).describe('phone number of client (required!)'),
  address: z
    .string()
    .nonempty()
    .min(3)
    .max(700)
    .describe('address to for client address (required!)'),
  email: z
    .string()
    .nonempty()
    .email()
    .min(4)
    .max(200)
    .describe('email address of client (required!)'),
});

const CreateTaxSchema = z.object({
  enabled: z.boolean().default(true).describe('defines if the tax should be visible or not, make it false by default'),
  isDefault: z.boolean().default(false).describe('defines if the tax should selected while adding invoice, make it false by default'),
  taxName: z.string().nonempty().describe('name of the tax'),
  taxValue: z.number().describe('percentage of the tax'),
});

const CreatePaymentModeSchema = z.object({
  enabled: z.boolean().default(true).describe('defines if the payment mode should be visible or not'),
  isDefault: z.boolean().default(false).describe('defines if the payment mode should selected while adding invoice'),
  name: z.string().nonempty().describe('name of the payment mode'),
  description: z.string().nonempty().describe('description of payment mode'),
});

const RequestSchema = z.object({
  message: z
    .string({ message: 'message should be string' })
    .nonempty({ message: 'required message' }),
});

module.exports = { CreateClientSchema, RequestSchema, CreateTaxSchema, CreatePaymentModeSchema };
