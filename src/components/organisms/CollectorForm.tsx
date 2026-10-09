"use client";

import { Button } from "@/components/atoms/Button";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { Input } from "@/components/atoms/Input";
import { Select } from "@/components/atoms/Select";
import { Text } from "@/components/atoms/Text";
import { Alert } from "@/components/molecules/Alert";
import { FormField } from "@/components/molecules/FormField";
import { FormWithAside } from "@/components/molecules/FormWithAside";
import { FormFieldset } from "@/components/molecules/FormFieldset";
import { COLLECTORS_TEXT } from "@/content/collectors";
import type { PortfolioOption } from "@/features/collectors/get-portfolio-options.server";
import type { useCollectorForm } from "@/features/collectors/use-collector-form";

type CollectorFormState = ReturnType<typeof useCollectorForm>;

export interface CollectorFormProps {
  readonly form: CollectorFormState;
  readonly portfolios: readonly PortfolioOption[];
}

/** Formulario "Registrar cobrador". Solo diseño: la lógica vive en `useCollectorForm`. */
export function CollectorForm({
  form,
  portfolios,
}: Readonly<CollectorFormProps>) {
  const { values, fieldErrors, formError, isSubmitting, setField, submit } =
    form;
  const text = COLLECTORS_TEXT.form;

  return (
    <FormWithAside aside={text.aside}>
      <form
        onSubmit={submit}
        noValidate
        aria-label={text.title}
        className="flex max-w-lg flex-col gap-5"
      >
        <div className="flex flex-col gap-1">
          <Text
            variant="title"
            as="h1"
            weight="bold"
            className="text-foreground"
          >
            {text.title}
          </Text>
          <Text variant="label" className="text-foreground/70">
            {text.subtitle}
          </Text>
        </div>

        <FormFieldset>
          <FormField label={text.fullName.label} error={fieldErrors.fullName}>
            <Input
              name="fullName"
              autoComplete="off"
              placeholder={text.fullName.placeholder}
              value={values.fullName}
              onChange={setField("fullName")}
            />
          </FormField>
          <FormField
            label={text.nationalId.label}
            hint={text.nationalId.hint}
            error={fieldErrors.nationalId}
          >
            <Input
              name="nationalId"
              inputMode="numeric"
              autoComplete="off"
              placeholder={text.nationalId.placeholder}
              value={values.nationalId}
              onChange={setField("nationalId")}
            />
          </FormField>
          <FormField
            label={text.phone.label}
            hint={text.phone.hint}
            error={fieldErrors.phone}
          >
            <Input
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="off"
              placeholder={text.phone.placeholder}
              value={values.phone}
              onChange={setField("phone")}
            />
          </FormField>
          <FormField
            label={text.contactEmail.label}
            hint={text.contactEmail.hint}
            error={fieldErrors.contactEmail}
          >
            <Input
              name="contactEmail"
              type="email"
              inputMode="email"
              autoComplete="off"
              placeholder={text.contactEmail.placeholder}
              value={values.contactEmail}
              onChange={setField("contactEmail")}
            />
          </FormField>
          <FormField
            label={text.portfolio.label}
            error={fieldErrors.portfolioId}
          >
            <Select
              name="portfolioId"
              value={values.portfolioId}
              onChange={setField("portfolioId")}
            >
              <option value="">{text.portfolio.placeholder}</option>
              {portfolios.map((portfolio) => (
                <option key={portfolio.id} value={portfolio.id}>
                  {portfolio.name}
                </option>
              ))}
            </Select>
          </FormField>
        </FormFieldset>

        {formError && <Alert tone="error">{formError}</Alert>}

        <div className="flex gap-3">
          <ButtonLink variant="outline" href="/cobradores" className="flex-1">
            {text.cancel}
          </ButtonLink>
          <Button type="submit" loading={isSubmitting} className="flex-1">
            {text.submit}
          </Button>
        </div>
      </form>
    </FormWithAside>
  );
}
