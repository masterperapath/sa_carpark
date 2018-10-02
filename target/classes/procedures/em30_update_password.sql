CREATE OR REPLACE FUNCTION audit.em30_update_password(usernameUP character varying, passwordNew character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  po_cursor                   REFCURSOR;
begin
		UPDATE user_profile 
		SET c_password = passwordNew
		WHERE c_username = usernameUP;
    RETURN audit.em30_select_user(COALESCE(usernameUP, NULL),COALESCE(NULL)); 
END;
$function$
