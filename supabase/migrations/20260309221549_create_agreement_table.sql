CREATE TABLE IF NOT EXISTS "public"."agreements" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "customer_id" "uuid" NOT NULL,
    "loan_id" "uuid" NOT NULL,
    "valor" numeric(12,2) NOT NULL,
    "data_acordo" "date" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "agreements_valor_check" CHECK (("valor" >= (0)::numeric))
);

ALTER TABLE "public"."agreements" OWNER TO "postgres";

COMMENT ON TABLE "public"."agreements" IS 'Agreements for a specific loan and customer.';
COMMENT ON COLUMN "public"."agreements"."valor" IS 'Agreement amount in reais.';
COMMENT ON COLUMN "public"."agreements"."data_acordo" IS 'Agreement date.';

ALTER TABLE ONLY "public"."agreements"
    ADD CONSTRAINT "agreements_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."agreements"
    ADD CONSTRAINT "agreements_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."agreements"
    ADD CONSTRAINT "agreements_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "public"."loans"("id") ON DELETE CASCADE;

CREATE INDEX "agreements_customer_id_idx" ON "public"."agreements" USING "btree" ("customer_id");
CREATE INDEX "agreements_loan_id_idx" ON "public"."agreements" USING "btree" ("loan_id");

ALTER TABLE "public"."agreements" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agreements_delete_own_customers" ON "public"."agreements" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."customers" "c"
  WHERE (("c"."id" = "agreements"."customer_id") AND ("c"."user_id" = "auth"."uid"())))));

CREATE POLICY "agreements_insert_own_customers" ON "public"."agreements" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."customers" "c"
  WHERE (("c"."id" = "agreements"."customer_id") AND ("c"."user_id" = "auth"."uid"())))));

CREATE POLICY "agreements_select_own_customers" ON "public"."agreements" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."customers" "c"
  WHERE (("c"."id" = "agreements"."customer_id") AND ("c"."user_id" = "auth"."uid"())))));

CREATE POLICY "agreements_update_own_customers" ON "public"."agreements" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."customers" "c"
  WHERE (("c"."id" = "agreements"."customer_id") AND ("c"."user_id" = "auth"."uid"()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."customers" "c"
  WHERE (("c"."id" = "agreements"."customer_id") AND ("c"."user_id" = "auth"."uid"())))));

GRANT ALL ON TABLE "public"."agreements" TO "anon";
GRANT ALL ON TABLE "public"."agreements" TO "authenticated";
GRANT ALL ON TABLE "public"."agreements" TO "service_role";
