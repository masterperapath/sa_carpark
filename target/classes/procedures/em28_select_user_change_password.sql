CREATE OR REPLACE FUNCTION audit.em28_select_user_change_password(pi_mid character varying, pi_username character varying, pi_groupname character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  po_cursor                   REFCURSOR;
  v_sql						  VARCHAR(32000);
BEGIN
  v_sql := '
SELECT  box.i_mid_id, 
		usr.c_username, 
		grp.c_group_name, 
		box.i_user_id 
FROM box_profile box 
JOIN user_profile usr ON box.i_user_id = usr.i_user_id
JOIN group_profile grp ON box.i_group_id = grp.i_group_id
  WHERE box.i_mid_id <> 0';

IF  pi_mid IS NOT NULL THEN    	
    	v_sql := v_sql || ' AND box.i_mid_id = ' || pi_mid ::NUMERIC || '';
END IF;

IF pi_username IS NOT NULL THEN 
      	v_sql := v_sql || ' AND LOWER(usr.c_username) =  LOWER( '''|| pi_username ||''' )';
END IF;

IF pi_groupname IS NOT NULL THEN 
      	v_sql := v_sql || ' AND LOWER(grp.c_group_name) = LOWER( '''|| pi_groupname ||''' )';
END IF;

	OPEN po_cursor FOR EXECUTE v_sql;
    RETURN po_cursor;
END
$function$
