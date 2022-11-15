
CREATE TABLE public.restaurant_report (
	start_time timestamp NOT NULL,
	end_time timestamp NOT NULL,
	id bigserial NOT NULL,
	total_duration_seconds int4 NOT NULL,
	CONSTRAINT restaurant_report_pk PRIMARY KEY (id)
);

CREATE TABLE public.pizzas_reports (
	start_time timestamp NOT NULL,
	end_time timestamp NOT NULL,
	total_duration_seconds int4 NOT NULL,
	number_of_toppins int4 NOT NULL DEFAULT 0,
	main_report_fk bigserial NOT NULL,
	CONSTRAINT pizzas_reports_fk FOREIGN KEY (main_report_fk) REFERENCES public.restaurant_report(id)
);