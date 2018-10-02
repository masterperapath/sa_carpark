CREATE OR REPLACE FUNCTION audit.em12_search_user_by_mid(pi_mid character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  po_cursor                   REFCURSOR;
BEGIN
    OPEN po_cursor FOR
	SELECT box.i_group_id, box.i_user_id, usr.c_username, COALESCE(TO_CHAR(box.dt_install, 'DD-MM-YYYY hh24:mi'), '') AS dt_install, 
		   CASE WHEN box.c_plate_number = '' THEN '-'
		   		WHEN box.c_plate_number IS NULL THEN '-'
		   		ELSE box.c_plate_number 
		   END AS c_plate_number, 
		   CASE WHEN box.c_car_code = '' THEN '-'
		   		WHEN box.c_car_code IS NULL THEN '-'
		   		ELSE box.c_car_code 
		   END AS c_car_code, 
		   CASE WHEN box.i_show_pic = 1 THEN 1
		   		WHEN box.i_show_pic = 2 THEN 2
		   		WHEN box.i_show_pic = 3 THEN 3
		   		WHEN box.i_show_pic = 4 THEN 4
		   		WHEN box.i_show_pic = 5 THEN 5
		   		WHEN box.i_show_pic = 6 THEN 6
		   		WHEN box.i_show_pic = 7 THEN 7
		   		WHEN box.i_show_pic = 8 THEN 8
		   		WHEN box.i_show_pic = 101 THEN 101
		   		WHEN box.i_show_pic = 102 THEN 102
		   		WHEN box.i_show_pic = 103 THEN 103
		   		WHEN box.i_show_pic = 104 THEN 104
		   		ELSE 1
		   END AS i_show_pic,
		   CASE WHEN box.c_technician = '' THEN '-'
		   		WHEN box.c_technician IS NULL THEN '-'
		   		ELSE box.c_technician 
		   END AS c_technician, 
		   CASE WHEN box.c_car_type = '' THEN '-'
		   		WHEN box.c_car_type IS NULL THEN '-'
		   		ELSE box.c_car_type 
		   END AS c_car_type, 
		   CASE WHEN box.c_car_note = '' THEN '-'
		   		WHEN box.c_car_note IS NULL THEN '-'
		   		ELSE box.c_car_note
		   END AS c_car_note , 
		   CASE WHEN box.c_box_note = '' THEN '-'
		   		 WHEN box.c_box_note IS NULL THEN '-'
		   		 ELSE box.c_box_note
		   	END AS c_box_note       
	FROM box_profile box
	JOIN user_profile usr on usr.i_user_id = box.i_user_id
	WHERE box.i_mid_id = pi_mid::NUMERIC;
  RETURN po_cursor;
END
$function$
