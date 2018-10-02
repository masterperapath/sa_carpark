CREATE TABLE admin_page (
	"page_id" int4 NOT NULL DEFAULT nextval('audit.sequence_page_id'::regclass),
	"page_code" varchar(100) NOT NULL,
	"page_dese" varchar(255) NOT NULL,
	"header_menu_id" int4,
	CONSTRAINT admin_page_pkay PRIMARY KEY ("page_id")
)
WITH (
	OIDS=FALSE
) ;