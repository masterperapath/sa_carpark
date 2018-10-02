CREATE OR REPLACE FUNCTION audit.esu03_send_password_user(pi_username character varying, pi_emailuser character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  po_cursor                   REFCURSOR;
BEGIN
	 OPEN po_cursor FOR
		SELECT c_username, c_password
		FROM user_profile 
		WHERE c_username = pi_username;
	RETURN po_cursor;
END
$function$
