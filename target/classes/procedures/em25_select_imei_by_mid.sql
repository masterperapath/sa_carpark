CREATE OR REPLACE FUNCTION audit.em25_select_imei_by_mid(pi_mid character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  po_cursor                   REFCURSOR;
  v_mid_check  				 NUMERIC := 0;
  v_max_mid					 NUMERIC;
BEGIN
	
	SELECT COUNT(1)
	INTO v_mid_check
	FROM config_receiver
	WHERE i_mid_id = pi_mid::NUMERIC;
	
	IF v_mid_check != 0 THEN 
	
	SELECT MAX(i_mid_id) 
	INTO v_max_mid 
	FROM config_receiver 
	WHERE i_mid_id::VARCHAR LIKE '' || pi_mid || '%';
	
    OPEN po_cursor FOR
        SELECT con.i_mid_id, 
        		   CASE WHEN LENGTH(v_max_mid::VARCHAR) = 5 THEN ((v_max_mid::VARCHAR)||'0')::NUMERIC ELSE (v_max_mid+1)::NUMERIC END AS mid_store,
        		   con.i_imei, COALESCE(box.c_box_note, '-') AS c_box_note, box.c_sim_number
		FROM config_receiver con
			RIGHT JOIN box_profile box on box.i_mid_id = con.i_mid_id
		WHERE con.i_mid_id = pi_mid::NUMERIC;
  	RETURN po_cursor;
  	
  	ELSE 
  	
  	OPEN po_cursor FOR SELECT 1 AS CheckMID;
    RETURN po_cursor;
    
	END IF;
END;
$function$
