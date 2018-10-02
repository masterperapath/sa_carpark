CREATE OR REPLACE FUNCTION audit.select_status_user_detail(pi_group_id character varying, pi_groupname character varying, pi_mid character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  po_cursor                   REFCURSOR;
  v_sql						  VARCHAR(32000);
BEGIN
  v_sql := '
   SELECT 	box.i_mid_id,
		   	LPAD(grp.i_group_id::VARCHAR, 7, ''0'') AS i_group_id,
    	   		box.i_user_id,
    	   		grp.c_group_name,
    	   		box.c_plate_number,
    	   		box.c_car_code,
		   	box.c_car_note
	FROM public.box_profile box
    RIGHT JOIN public.group_profile grp ON grp.i_group_id = box.i_group_id
          JOIN public.user_profile usr ON usr.i_user_id = box.i_user_id
    WHERE grp.i_group_id <> 353 ';
      
IF  pi_mid IS NOT NULL THEN    	
    	v_sql := v_sql || ' AND box.i_mid_id = ' || pi_mid ::NUMERIC || '';
END IF;
 
IF pi_group_id IS NOT NULL THEN 
      	v_sql := v_sql || ' AND grp.i_group_id = ' || pi_group_id :: NUMERIC || '';
END IF;

IF pi_groupname IS NOT NULL THEN 
      	v_sql := v_sql || ' AND LOWER(grp.c_group_name) = LOWER( '''|| pi_groupname ||''' )';
END IF;

	OPEN po_cursor FOR EXECUTE v_sql;
    RETURN po_cursor;
END
$function$
