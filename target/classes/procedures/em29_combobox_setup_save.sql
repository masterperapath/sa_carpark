CREATE OR REPLACE FUNCTION audit.em29_combobox_setup_save(pi_mid character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  po_cursor         REFCURSOR;
BEGIN
   OPEN po_cursor FOR    
		SELECT prmd.c_prmd_entry_code AS entry_cd, prmd.c_prmd_entry_desc AS entry_name
		, prmd.c_prmd_comment AS cmd_desc, COALESCE(cre.c_cre_value, prmd.c_prmd_value_2) AS cmd_value
		, prmd.c_prmd_value_1 AS cmd_example, prmd.c_prmd_value_3 AS param3, prmd.c_prmd_value_5 AS param5, prmd.c_prmd_value_4 AS param4
		FROM parameter_detail prmd
		LEFT JOIN config_receiver_expansion cre ON (cre.i_mid_id = pi_mid::NUMERIC AND cre.i_cre_prm_no = prmd.i_prmh_no AND cre.c_cre_entry_code = prmd.c_prmd_entry_code)
		WHERE prmd.i_prmh_no = 1
		AND cre.c_cre_entry_code IS NULL
		ORDER BY c_prmd_entry_code ASC;
    
    RETURN po_cursor;
    
END;
$function$