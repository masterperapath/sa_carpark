CREATE TABLE audit.history_swap_box
(
    his_chg_id BIGINT DEFAULT nextval('audit.his_chg_id_seq ':: regclass) PRIMARY KEY,
    his_chg_mid_old NUMERIC,
    his_chg_imei_old NUMERIC,
    his_chg_mid_store NUMERIC,
    his_chg_imei_store NUMERIC,
    his_chg_mid_new NUMERIC
);
COMMENT ON COLUMN audit.history_swap_box.his_chg_mid_old IS 'mid ของกล่องที่ต้องการสลับ';
COMMENT ON COLUMN audit.history_swap_box.his_chg_imei_old IS 'imei ใหม่ที่เอามาจากกล่องใหม่มาแทน กล่องที่ต้องการสลับ';
COMMENT ON COLUMN audit.history_swap_box.his_chg_mid_store IS 'mid ของกล่องที่ นำเลข mid ของกล่องที่ต้องการสลับมา ทำให้เป็น 6 หลัก';
COMMENT ON COLUMN audit.history_swap_box.his_chg_imei_store IS 'imei ของกล่องที่ นำเลข mid ของกล่องที่ต้องการสลับมา ทำให้เป็น 6 หลัก (เลข imei ของกล่องเก่า ที่ต้องการสลับ)';
COMMENT ON COLUMN audit.history_swap_box.his_chg_mid_new IS 'mid ของกล่องใหม่ที่นำมาสลับ
';
COMMENT ON TABLE audit.history_swap_box IS 'เก็บประวัติการสลับกล่อง';