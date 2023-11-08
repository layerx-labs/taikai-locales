import { CompileEmailTemplateInput, CompileNotificationTemplateInput } from '@types';
import { readFile } from 'fs/promises';
import handlebars from 'handlebars';
import { join } from 'path';

/**
 * Compile an email template
 * @param param0 { CompileEmailTemplateInput }
 * @returns
 */
export async function compileEmailTemplate({
  context,
  locale,
  templateName,
}: CompileEmailTemplateInput) {
  const common = require(`../locales/${locale}/emails/common`).default;
  const subjects = require(`../locales/${locale}/emails/index`).default;

  const template = await readFile(
    join(__dirname, `../locales/${locale}/emails/${templateName}.hbs`),
    { encoding: 'utf8' }
  );

  return {
    content: handlebars.compile(template)({ ...common, ...context }),
    subject: handlebars.compile(subjects[templateName].subject)(context),
    preheader: handlebars.compile(subjects[templateName].preheader)(context),
  };
}

export function compileNotificationTemplate({
  context,
  locale,
  templateName,
}: CompileNotificationTemplateInput) {
  const notifications = require(`../locales/${locale}/notifications/index`).default;
  return handlebars.compile(notifications[templateName])(context);
}
