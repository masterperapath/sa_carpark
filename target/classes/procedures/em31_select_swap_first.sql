CREATE OR REPLACE FUNCTION audit.em31_select_swap_first(pi_mid NUMERIC)
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
	WHERE box.i_mid_id = pi_mid::NUMERIC;
	
	IF v_mid_check != 0 THEN 
	
		SELECT MIN(box.i_mid_id)
		INTO v_max_mid 
		FROM box_profile box 
		LEFT JOIN config_receiver con ON box.i_mid_id = con.i_mid_id
		WHERE con.i_mid_id IS NULL
		AND box.i_mid_id::VARCHAR LIKE '' || pi_mid || '%';
	
		IF v_max_mid IS NULL THEN 
			SELECT MAX(i_mid_id) 
			INTO v_max_mid 
			FROM config_receiver 
			WHERE i_mid_id::VARCHAR LIKE '' || pi_mid || '%';
			
			IF v_max_mid = pi_mid THEN 
				v_max_mid = ((v_max_mid::VARCHAR)||'0')::NUMERIC;
			ELSE
				v_max_mid = v_max_mid + 1;
			END IF;
		END IF;
	
	    OPEN po_cursor FOR
	        SELECT v_max_mid AS swapMid, con.i_imei, COALESCE(box.c_box_note, '-') AS c_box_note, box.c_sim_number, grp.c_group_name
	        	   , box.c_car_code, box.c_plate_number 
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