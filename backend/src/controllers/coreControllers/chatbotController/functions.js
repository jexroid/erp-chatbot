const { default: mongoose } = require('mongoose');
const { CreateClientSchema, CreateTaxSchema, CreatePaymentModeSchema } = require('./validation');
const { tool } = require('@langchain/core/tools');

const StorePaymentModeEntity = async ({ enable, isDefault, name, description }) => {
  const validation = CreatePaymentModeSchema.safeParse({ enable, isDefault, name, description });
  const Model = mongoose.model('PaymentMode');
  if (!validation.success) {
    return {
      success: false,
      result: null,
      message: validation.error.errors[0]?.message,
    };
  }
  if (isDefault) {
    await Model.updateMany({}, { isDefault: false });
  }

  const countDefault = await Model.countDocuments({
    isDefault: true,
  });

  const result = await new Model({
    ...req.body,

    isDefault: countDefault < 1 ? true : false,
  }).save();

  return {
    success: true,
    result: result,
    message: 'payment mode created successfully',
  };
};

const StoreClientEntity = async ({ name, phone, address, email }) => {
  const validation = CreateClientSchema.safeParse({ name, phone, address, email });
  if (!validation.success) {
    return {
      success: false,
      result: null,
      message: validation.error.errors[0]?.message,
    };
  }
  const model = mongoose.model('Client');
  const result = await new model({
    ...validation.data,
  }).save();

  return {
    success: true,
    result,
    message: 'Successfully Created the document in Model ',
  };
};

const StoreTaxEntity = async ({ enable, isDefault, taxName, taxValue }) => {
  const validation = CreateTaxSchema.safeParse({ enable, isDefault, taxName, taxValue });
  if (!validation.success) {
    return {
      success: false,
      result: null,
      message: validation.error.errors[0]?.message,
    };
  }
  const Model = mongoose.model('Taxes');

  if (isDefault) {
    await Model.updateMany({}, { isDefault: false });
  }

  const countDefault = await Model.countDocuments({
    isDefault: true,
  });

  const result = await new Model({
    ...validation.data,

    isDefault: countDefault < 1 ? true : false,
  }).save();

  return {
    success: true,
    result: result,
    message: 'Tax created successfully',
  };
};

// ! USING THIS `tool` we will also have auto validation 👌
const AddClient = tool(StoreClientEntity, {
  strict: true,
  name: 'AddClient',
  description: 'Add a new Client in database.',
  schema: CreateClientSchema,
  required: ['name', 'address', 'phone', 'email'],
  additionalProperties: false
});

const AddTax = tool(StoreTaxEntity, {
  strict: true,
  name: 'AddTax',
  description: 'Add a new Tax in database.',
  schema: CreateTaxSchema,
  required: ['taxName', 'taxValue'],
  additionalProperties: false
});

const AddPaymentMode = tool(StorePaymentModeEntity, {
  strict: true,
  name: 'AddPaymentMode',
  description: 'Add a new Payment Mod in database.',
  schema: CreatePaymentModeSchema,
  required: ['name', 'description'],
  additionalProperties: false
});

module.exports = {
  AddClient,
  AddTax,
  AddPaymentMode,
  StoreClientEntity,
  StoreTaxEntity,
  StorePaymentModeEntity,
};
