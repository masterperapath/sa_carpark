CREATE OR REPLACE FUNCTION audit.em29_combobox_setup()
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  po_cursor         REFCURSOR;
BEGIN
	       OPEN po_cursor FOR    
	           SELECT prmd.i_prmh_no AS prmh_no,
	           	  prmd.c_prmd_entry_code AS entry_cd,
	              prmd.c_prmd_entry_desc AS entry_name,
	              prmd.c_prmd_comment AS cmd_desc,
	              prmd.c_prmd_value_1 AS param1,
	              prmd.c_prmd_value_2 AS param2,
	              prmd.c_prmd_value_3 AS param3,
	              prmd.c_prmd_value_4 AS param4,
	              prmd.c_prmd_value_5 AS param5
	        FROM parameter_detail prmd
	        WHERE prmd.i_prmh_no = 1
	        ORDER BY c_prmd_entry_code;
	        
	        RETURN po_cursor;
    
END;
$function$