-- Tabela de pagamentos para empréstimos e acordos
CREATE TABLE IF NOT EXISTS "public"."payments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "loan_id" "uuid" NOT NULL,
    "agreement_id" "uuid",
    "customer_id" "uuid" NOT NULL,
    "valor" numeric(12,2) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "payments_valor_check" CHECK (("valor" > (0)::numeric))
);

ALTER TABLE "public"."payments" OWNER TO "postgres";

COMMENT ON TABLE "public"."payments" IS 'Pagamentos realizados para empréstimos e acordos.';
COMMENT ON COLUMN "public"."payments"."valor" IS 'Valor do pagamento em reais.';

ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "public"."loans"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_agreement_id_fkey" FOREIGN KEY ("agreement_id") REFERENCES "public"."agreements"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE CASCADE;

CREATE INDEX "payments_loan_id_idx" ON "public"."payments" USING "btree" ("loan_id");
CREATE INDEX "payments_agreement_id_idx" ON "public"."payments" USING "btree" ("agreement_id");
CREATE INDEX "payments_customer_id_idx" ON "public"."payments" USING "btree" ("customer_id");

-- RLS
ALTER TABLE "public"."payments" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payments_select_own_customers" ON "public"."payments" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."customers" "c"
  WHERE (("c"."id" = "payments"."customer_id") AND ("c"."user_id" = "auth"."uid"())))));

CREATE POLICY "payments_insert_own_customers" ON "public"."payments" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."customers" "c"
  WHERE (("c"."id" = "payments"."customer_id") AND ("c"."user_id" = "auth"."uid"())))));

CREATE POLICY "payments_update_own_customers" ON "public"."payments" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."customers" "c"
  WHERE (("c"."id" = "payments"."customer_id") AND ("c"."user_id" = "auth"."uid"()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."customers" "c"
  WHERE (("c"."id" = "payments"."customer_id") AND ("c"."user_id" = "auth"."uid"())))));

CREATE POLICY "payments_delete_own_customers" ON "public"."payments" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."customers" "c"
  WHERE (("c"."id" = "payments"."customer_id") AND ("c"."user_id" = "auth"."uid"())))));

GRANT ALL ON TABLE "public"."payments" TO "anon";
GRANT ALL ON TABLE "public"."payments" TO "authenticated";
GRANT ALL ON TABLE "public"."payments" TO "service_role";
