-- Tambahkan foreign key user_id di project dan project_d ke users(id)
ALTER TABLE project
  ADD CONSTRAINT fk_project_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE project_d
  ADD CONSTRAINT fk_projectd_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
