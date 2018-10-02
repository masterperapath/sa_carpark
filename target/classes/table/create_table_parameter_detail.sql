CREATE TABLE public.parameter_detail (
	i_prmh_no NUMERIC NOT NULL,
	c_prmd_entry_code VARCHAR(24) NOT NULL,
	c_prmd_entry_desc VARCHAR(160),
	c_prmd_comment VARCHAR(4000),
	c_prmd_value_1 VARCHAR(1000),
	c_prmd_value_2 VARCHAR(500),
	c_prmd_value_3 VARCHAR(500),
	c_prmd_value_4 VARCHAR(500),
	c_prmd_value_5 VARCHAR(500),
	c_prmd_value_6 VARCHAR(250),
	c_prmd_value_7 VARCHAR(250),
	c_prmd_value_8 VARCHAR(250),
	c_prmd_value_9 VARCHAR(250),
	c_prmd_value_10 VARCHAR(250),
	dt_create_date TIMESTAMP NOT NULL,
	c_create_user VARCHAR(160) NOT NULL,
	dt_update_date TIMESTAMP NOT NULL,
	c_update_user VARCHAR(160) NOT NULL,
	CONSTRAINT parameter_detail_pkay PRIMARY KEY (i_prmh_no,c_prmd_entry_code)
)
WITH (
	OIDS=FALSE
) ;
COMMENT ON COLUMN parameter_detail.i_prmh_no is 'Parameter Table Number';
COMMENT ON COLUMN parameter_detail.c_prmd_entry_code is 'Entry Code';
COMMENT ON COLUMN parameter_detail.c_prmd_entry_desc is 'Entry Description';
COMMENT ON COLUMN parameter_detail.c_prmd_comment is 'Comment';
COMMENT ON COLUMN parameter_detail.c_prmd_value_1 is 'Parameter Value 1';
COMMENT ON COLUMN parameter_detail.c_prmd_value_2 is 'Parameter Value 2';
COMMENT ON COLUMN parameter_detail.c_prmd_value_3 is 'Parameter Value 3';
COMMENT ON COLUMN parameter_detail.c_prmd_value_4 is 'Parameter Value 4';
COMMENT ON COLUMN parameter_detail.c_prmd_value_5 is 'Parameter Value 5';
COMMENT ON COLUMN parameter_detail.c_prmd_value_6 is 'Parameter Value 6';
COMMENT ON COLUMN parameter_detail.c_prmd_value_7 is 'Parameter Value 7';
COMMENT ON COLUMN parameter_detail.c_prmd_value_8 is 'Parameter Value 8';
COMMENT ON COLUMN parameter_detail.c_prmd_value_9 is 'Parameter Value 9';
COMMENT ON COLUMN parameter_detail.c_prmd_value_10 is 'Parameter Value 10';
COMMENT ON COLUMN parameter_detail.dt_create_date is 'วัน/เวลาที่สร้าง record';
COMMENT ON COLUMN parameter_detail.c_create_user is 'user ที่สร้าง record';
COMMENT ON COLUMN parameter_detail.dt_update_date is 'วัน/เวลาที่แก้ไขrecord';
COMMENT ON COLUMN parameter_detail.c_update_user is 'user ที่แก้ไข record';