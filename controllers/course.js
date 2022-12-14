const Course = require("../models").Course;
const Student = require("../models").Student;
const Lecturer = require("../models").Lecturer;
const StudentCourse = require("../models").StudentCourse;

module.exports = {
  list(req, res) {
    return Course.findAll({
      include: [
        {
          model: Student,
          as: "students",
        },
        {
          model: Lecturer,
          as: "lecturer",
        },
      ],
      order: [
        ["createdAt", "DESC"],
        [{ model: Student, as: "students" }, "createdAt", "DESC"],
      ],
    })
      .then((courses) => res.status(200).send(courses))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getById(req, res) {
    return Course.findByPk(req.params.id, {
      include: [
        {
          model: Course,
          as: "course",
        },
      ],
    })
      .then((course) => {
        if (!course) {
          return res.status(404).send({
            message: "Course Not Found",
          });
        }
        return res.status(200).send(course);
      })
      .catch((error) => res.status(400).send(error));
  },

  add(req, res) {
    return Course.create({
      course_name: req.body.course_name,
    })
      .then((course) => res.status(201).send(course))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    return Course.findByPk(req.params.id, {
      include: [
        {
          model: Course,
          as: "course",
        },
      ],
    })
      .then((course) => {
        if (!course) {
          return res.status(404).send({
            message: "Course Not Found",
          });
        }
        return course
          .update({
            course_name: req.body.course_name || classroom.course_name,
          })
          .then(() => res.status(200).send(course))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return Course.findByPk(req.params.id)
      .then((course) => {
        if (!course) {
          return res.status(400).send({
            message: "Course Not Found",
          });
        }
        return course
          .destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  async addStudent(req, res) {
    const { body } = req;
    console.log(body);
    try {
      const course = await Course.findByPk(body.course_id);
      if (!course) {
        
        return res.status(404).send({
          message: "Course Not Found",
        });
      }

      let updateCourse = course.update({
        lecturer_id: body.lecture_id,
      });

      let insertStudent = StudentCourse.create({
        course_id: body.course_id,
        student_id: body.student_id,
        nilai: body.nilai,
        grade: body.grade,
      });

      [updateCourse,insertStudent] = await Promise.all([updateCourse,insertStudent])

      return res.status(200).send(insertStudent);
    } catch (error) {
      console.log("ERROR ",error);
      res.status(400).send(error);
    }
  },
};
