CREATE OR REPLACE FUNCTION audit.em28_update_user_change_password(pi_mid character varying, pi_username character varying, pi_password character varying, pi_groupname character varying, pi_userid character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  po_cursor                     REFCURSOR;
  v_sql						    VARCHAR(32000);
  v_groupname 	  				VARCHAR;
BEGIN
	UPDATE user_profile
	SET c_password = pi_password
	WHERE i_user_id = pi_userid :: NUMERIC;
	
  	RETURN audit.em28_select_user_change_password(pi_mid, pi_username, pi_groupname);
END;
$function$
