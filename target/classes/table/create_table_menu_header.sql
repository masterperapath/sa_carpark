CREATE TABLE admin_header_menu (
	header_menu_id int4 NOT NULL DEFAULT nextval('audit.sequence_header_menu_id'::regclass),
	header_menu_code varchar(100) NOT NULL,
	header_menu_desc varchar(255) NOT NULL,
	header_menu_icon varchar(255) NOT NULL,
	CONSTRAINT admin_header_menu_pkay PRIMARY KEY (header_menu_id)
)
WITH (
	OIDS=FALSE
) ;