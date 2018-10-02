CREATE OR REPLACE FUNCTION audit.em31_select_swap_second(pi_mid NUMERIC)
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
	FROM config_receiver con
	JOIN box_profile box on box.i_mid_id = con.i_mid_id
	JOIN group_profile grp ON (box.i_group_id = grp.i_group_id)
	WHERE grp.i_group_id IN (330, 351, 5066)
	AND box.i_mid_id = pi_mid::NUMERIC;
	
	IF v_mid_check != 0 THEN 
	
	SELECT MAX(i_mid_id) 
	INTO v_max_mid 
	FROM config_receiver 
	WHERE i_mid_id::VARCHAR LIKE '' || pi_mid || '%';
	
    OPEN po_cursor FOR
        SELECT con.i_imei, COALESCE(box.c_box_note, '-') AS c_box_note, box.c_sim_number, grp.c_group_name, box.c_car_code, box.c_plate_number 
		FROM config_receiver con
			JOIN box_profile box on box.i_mid_id = con.i_mid_id
			JOIN group_profile grp ON (box.i_group_id = grp.i_group_id)
		WHERE con.i_mid_id = pi_mid::NUMERIC;
  	RETURN po_cursor;
  	
  	ELSE 
  	
  	OPEN po_cursor FOR SELECT 1 AS CheckMID;
    RETURN po_cursor;
    
	END IF;
    
END;
$function$