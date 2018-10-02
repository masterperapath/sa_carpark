CREATE TABLE admin_permision (
	role_code int4 NOT NULL,
	page_id int4 NOT NULL,
	CONSTRAINT admin_permision_ukay UNIQUE (page_id,role_code)
)
WITH (
	OIDS=TRUE
) ;