CREATE TABLE public.config_receiver_expansion (
	i_mid_id int4 NOT NULL,
	I_cre_prm_no NUMERIC NOT NULL,
	c_cre_entry_code VARCHAR(24) NOT NULL,
	c_cre_value VARCHAR(500),
	c_cre_gprsout_referent_id int4 NOT NULL,
	dt_create_date TIMESTAMP NOT NULL,
	c_create_user VARCHAR(160) NOT NULL,
	dt_update_date TIMESTAMP NOT NULL,
	c_update_user VARCHAR(160) NOT NULL,
	CONSTRAINT config_receiver_expansion_pkay PRIMARY KEY (i_mid_id, I_cre_prm_no, c_cre_entry_code)
)
WITH (
	OIDS=FALSE
) ;
COMMENT ON COLUMN config_receiver_expansion.i_mid_id is 'Mid ของระบบ';
COMMENT ON COLUMN config_receiver_expansion.I_cre_prm_no is 'Id ของ  parameter_detail table';
COMMENT ON COLUMN config_receiver_expansion.c_cre_entry_code is 'Entry code ของ parameter_detail table';
COMMENT ON COLUMN config_receiver_expansion.c_cre_value is 'ค่าของ prms สำหรับคำสั่ง gprs ';
COMMENT ON COLUMN config_receiver_expansion.c_cre_gprsout_referent_id is 'Id ของ gprsserver_out table';
COMMENT ON COLUMN config_receiver_expansion.dt_create_date is 'วัน/เวลาที่สร้าง record';
COMMENT ON COLUMN config_receiver_expansion.c_create_user is 'user ที่สร้าง record';
COMMENT ON COLUMN config_receiver_expansion.dt_update_date is 'วัน/เวลาที่แก้ไขrecord';
COMMENT ON COLUMN config_receiver_expansion.c_update_user is 'user ที่แก้ไข record';