CREATE OR REPLACE FUNCTION audit.em07_delete_admin_user(pi_userid character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
BEGIN
		DELETE FROM admin_user 
		WHERE id = pi_userid::NUMERIC;
	
    RETURN audit.em07_select_admin_user(NULL, NULL);
END;
$function$
