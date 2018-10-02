CREATE TABLE public.parameter_header (
	i_prmh_no NUMERIC NOT NULL,
	c_prmh_desc VARCHAR(200) NOT NULL,
	c_prmh_comment VARCHAR(4000),
	dt_create_date TIMESTAMP NOT NULL,
	c_create_user VARCHAR(160) NOT NULL,
	dt_update_date TIMESTAMP NOT NULL,
	c_update_user VARCHAR(160) NOT NULL,
	CONSTRAINT parameter_header_pkay PRIMARY KEY (i_prmh_no)
)
WITH (
	OIDS=FALSE
) ;
COMMENT ON COLUMN parameter_header.i_prmh_no is 'Id ของ parameter_header table';
COMMENT ON COLUMN parameter_header.c_prmh_desc is 'คำอธิบายของ  parameter';
COMMENT ON COLUMN parameter_header.c_prmh_comment is 'คำอธิบายเพิ่มเติมของ  parameter';
COMMENT ON COLUMN parameter_header.dt_create_date is 'วัน/เวลาที่สร้าง record';
COMMENT ON COLUMN parameter_header.c_create_user is 'user ที่สร้าง record';
COMMENT ON COLUMN parameter_header.dt_update_date is 'วัน/เวลาที่แก้ไข record';
COMMENT ON COLUMN parameter_header.c_update_user is 'user ที่แก้ไข record';