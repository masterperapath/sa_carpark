CREATE OR REPLACE FUNCTION audit.em07_update_admin_user(pi_userid character varying, pi_username character varying, pi_password character varying, pi_realname character varying, pi_displayname character varying, pi_email character varying, pi_userrole character varying, pi_sendmail boolean, pi_useradmin character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  po_cursor                   REFCURSOR;
  v_admin_check            numeric := 0;
BEGIN
          select count(1)
          into v_admin_check
          from admin_user
          where username = pi_username;
          
	      IF      pi_userid IS NULL THEN      
                  IF    v_admin_check = 0 :: NUMERIC THEN
                        INSERT INTO   admin_user(id,username, password, realname, displayname, email, user_role, send_sumary_mail,update_user,create_user,update_date,create_date)
                        VALUES        (NEXTVAL('adminuser_seq'),pi_username, pi_password, pi_realName, pi_displayName, pi_email, pi_userRole::NUMERIC, pi_sendMail,pi_useradmin,pi_useradmin,now(),now());
                  RETURN audit.em07_select_admin_user(pi_username,pi_userRole);
                  ELSE  
                        OPEN po_cursor FOR SELECT 1 AS CheckUser;
                        RETURN po_cursor;   
                  END IF;
          ELSE    
                  UPDATE      admin_user
                  SET         password = pi_password, realname = pi_realName, update_user = pi_useradmin, update_date = now()
                              , displayname=pi_displayName, email = pi_email, user_role = pi_userRole::NUMERIC,send_sumary_mail = pi_sendMail
                  WHERE       id = pi_userid::NUMERIC;
          RETURN audit.em07_select_admin_user(pi_username,pi_userRole);
    END IF;
END;
$function$
